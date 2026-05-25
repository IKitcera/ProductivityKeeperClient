import { createReducer, on } from '@ngrx/store';
import { setDiaryViewConfig } from './diary-view-config.actions';
import { initialState } from './diary-view-config.state';

export const diaryViewConfigFeatureKey = 'diaryConfig';

export const diaryViewConfigReducer = createReducer(
  initialState,
  on(setDiaryViewConfig, (state, { config }) => ({ ...state, config }))
);

