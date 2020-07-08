import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';

export class MyMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        if (params.interpolateParams) {
            return params.interpolateParams["default"] || params.key;
          }
          return params.key;
    }
}