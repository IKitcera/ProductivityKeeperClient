import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DiaryViewConfigState } from './diary-view-config.state';
import { diaryViewConfigFeatureKey } from './diary-view-config.reducer';

export const selectDiaryViewConfigState = createFeatureSelector<DiaryViewConfigState>(diaryViewConfigFeatureKey);

export const selectDiaryViewConfig = createSelector(
  selectDiaryViewConfigState,
  (state) => state.config
);

