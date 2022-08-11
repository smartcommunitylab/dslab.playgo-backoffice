import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../app.component';
import { LANGUAGE_LOCAL_STORAGE } from './constants/constants';

const rangeLabelIta = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `0 di ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} di ${length}`;
};

const rangeLabelEng = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 of ${length}`;
    }
  
    length = Math.max(length, 0);
  
    const startIndex = page * pageSize;
  
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
  
    return `${startIndex + 1} - ${endIndex} of ${length}`;
  };

export function getPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  var localStorageLanguage= localStorage.getItem(LANGUAGE_LOCAL_STORAGE);
  if(localStorageLanguage==='it'){
    paginatorIntl.itemsPerPageLabel = 'Elementi per pagina:';
    paginatorIntl.nextPageLabel = 'Pagina successiva';
    paginatorIntl.previousPageLabel = 'Pagina precendente';
    paginatorIntl.firstPageLabel = 'Prima pagina';
    paginatorIntl.lastPageLabel = 'Ultima pagina';
    paginatorIntl.getRangeLabel = rangeLabelIta;
  }else{
    paginatorIntl.itemsPerPageLabel = 'Items per page:';
    paginatorIntl.nextPageLabel = 'Next page';
    paginatorIntl.previousPageLabel = 'Previus page';
    paginatorIntl.firstPageLabel = 'First page';
    paginatorIntl.lastPageLabel = 'Last page';
    paginatorIntl.getRangeLabel = rangeLabelEng;
  }


  return paginatorIntl;
}
