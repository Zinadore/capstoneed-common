import { Injectable } from '@angular/core';
import { CustomHttp } from './customHttp';
import { IAppState } from '../Store/Reducers/index';
import { Store } from '@ngrx/store';
import { PeerAssessmentActions } from '../Store/Actions/peer-assessment.actions';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../Constants/settings';
import { PeerAssessment } from '../Store/Models/peer-assessment';
import { IterationActions } from '../Store/Actions/iteration.actions';

@Injectable()
export class PeerAssessmentService {

  constructor(private chttp: CustomHttp, private store: Store<IAppState>) {

  }

  public getAllActive(): void {
    this.store.dispatch(PeerAssessmentActions.getAllActive());
  }

  public getAllActive$(): Observable<Response> {
    return this.chttp.get(`${BASE_URL}/pa_forms`)
      .map(res => res.json())
      .map(json => json.pa_forms)
      .do(forms => this.store.dispatch(PeerAssessmentActions.getAllActiveSuccess(forms)))
      .catch(err => {
        this.store.dispatch(PeerAssessmentActions.getAllActiveFail(err));
        return Observable.throw(err);
      })
  }

  public getForm(form_id: number): void {
    this.store.dispatch(PeerAssessmentActions.getForm(form_id));
  }

  public getForm$(form_id: number): Observable<Response> {
    return null;
  }

  public createForm(form_data): void {
    this.store.dispatch(PeerAssessmentActions.createPeerAssessmentForm(form_data))
  }

  public createForm$(form_data): Observable<Response> {

    let json = JSON.stringify(form_data);

    return this.chttp.post(`${BASE_URL}/assignments/${form_data.assignment_id}/pa_forms`, json)
      .do(res => this.store.dispatch(PeerAssessmentActions.createPeerAssessmentFormSuccess()))
      .catch(err => {
        this.store.dispatch(PeerAssessmentActions.createPeerAssessmentFormFail(err));
        return Observable.throw(err);
      })
  }

  public getQuestionTypes(): void {
    this.store.dispatch(PeerAssessmentActions.getQuestionTypes());
  }

  public getQuestionTypes$() {
    return this.chttp.get(`${BASE_URL}/question_types`)
      .map(res => res.json())
      .map(json => json.question_types)
      .do(types => this.store.dispatch(PeerAssessmentActions.getQuestionTypesSuccess(types)))
      .catch(err => {
        this.store.dispatch(PeerAssessmentActions.getQuestionTypesFail(err));
        return Observable.throw(err);
      })
  }

  public getQuestions(): void {
    this.store.dispatch(PeerAssessmentActions.getQuestions());
  }

  public getQuestions$(): Observable<Response> {
    return this.chttp.get(`${BASE_URL}/questions`)
      .map(res => res.json())
      .map(json => json.questions)
      .do(questions => this.store.dispatch(PeerAssessmentActions.getQuestionsSuccess(questions)))
      .catch(err => {
        this.store.dispatch(PeerAssessmentActions.getQuestionsFail(err));
        return Observable.throw(err);
      })
  }

  public createPeerAssessments(peer_assessments: PeerAssessment[]): void {
    let data = {
      "peer_assessments": peer_assessments
    };

    this.store.dispatch(PeerAssessmentActions.createPeerAssessments(data));
  }

  public createPeerAssessments$(peer_assessments: PeerAssessment[]): Observable<Response> {
    let data = {
      "peer_assessments": peer_assessments
    };

    let json = JSON.stringify(data);

    return this.chttp.post(`${BASE_URL}/peer_assessments`, json)
      .map(res => res.json())
      .map(json => json.points)
      .do(points => this.store.dispatch(PeerAssessmentActions.createPeerAssessmentsSuccess(points)))
      .catch(err => {
        this.store.dispatch(PeerAssessmentActions.createPeerAssessmentsFail(err));

        return Observable.throw(err);
      })
  }

  public getAllScored() {
    this.store.dispatch(IterationActions.getAllScored());
  }

  public getMarksForID(id: number) {
    return this.chttp.get(`${BASE_URL}/scored-iterations/${id}`)
      .map(res => res.json())
  }

}
