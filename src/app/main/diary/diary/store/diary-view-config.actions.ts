import { createAction, props } from '@ngrx/store';
import { DiaryViewConfig } from '../diary.component';

export const setDiaryViewConfig = createAction(
  '[Diary] Set View Config',
  props<{ config: DiaryViewConfig }>()
);

