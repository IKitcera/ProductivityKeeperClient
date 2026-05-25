import { DiaryViewConfig } from '../diary.component';

export interface DiaryViewConfigState {
  config: DiaryViewConfig;
}

export const initialDiaryViewConfig: DiaryViewConfig = {
  name: 'Royal Dusk',
  backgroundImage: 'linear-gradient(to right top, #a6679d, #455779, #2f4858)',
  textColor: '#f3f6fa',
  mutedTextColor: '#aeb6c1',
  maxMutedTextColor: '#d3dbe3',
};

export const initialState: DiaryViewConfigState = {
  config: initialDiaryViewConfig,
};

