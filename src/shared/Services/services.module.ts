import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { CedStoreModule } from '../Store/cedStore.module';
import { XHRBackend, RequestOptions } from '@angular/http';
import { CustomHttp } from './customHttp';
import { UnitService } from './unit.service';
import { AssignmentService } from './assignment.service';
import { ProjectService } from './project.service';
import { PeerAssessmentService } from './peer-assessment.service';
import { LogEntryService } from './log-entry.service';

@NgModule({
  imports: [CedStoreModule],
  providers: [  ]
})
export class ServicesModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        AuthenticationService,
        UnitService,
        AssignmentService,
        ProjectService,
        LogEntryService,
        PeerAssessmentService,
        {provide: CustomHttp, useFactory: (backend: XHRBackend, defaultOptions: RequestOptions) => {
          return new CustomHttp(backend, defaultOptions);
        }, deps: [XHRBackend, RequestOptions]}
      ]
    }
  }
}
