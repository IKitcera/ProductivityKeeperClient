import {DiaryViewConfig} from "./diary.component";

export const gradients: DiaryViewConfig[] = [
  {
    name: 'Transparent',
    backgroundImage: 'var(--background)',
    textColor: '#222831',
    mutedTextColor: '#333', // improved contrast
    maxMutedTextColor: '#bdbdbd'
  },
  {
    name: 'Cotton Candy Skies',
    backgroundImage: 'linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)',
    textColor: '#23213a',
    mutedTextColor: '#5a6b7a', // more contrast
    maxMutedTextColor: '#aab7c7' // more contrast
  },
  {
    name: 'Twilight Lagoon',
    backgroundImage: 'linear-gradient(to right top, #6d327c, #485DA6, #00a1ba, #00BF98, #36C486)',
    textColor: '#f3f6fa',
    mutedTextColor: '#d3dbe3', // less contrast
    maxMutedTextColor: '#aeb6c1' // more contrast
  },
  {
    name: 'Sunset Mirage',
    backgroundImage: 'linear-gradient(to right top, #ff7c7c, #da6d94, #00a1ba, #00BF98, #a6679d)',
    textColor: '#23213a',
    mutedTextColor: '#5a6b7a', // more visible
    maxMutedTextColor: '#bdbdc7'
  },
  {
    name: 'Berry Velvet',
    backgroundImage: 'linear-gradient(to right top, #ff7c7c, #da6d94, #a6679d)',
    textColor: '#23213a',
    mutedTextColor: '#5a6b7a', // more visible
    maxMutedTextColor: '#bdbdc7'
  },
  {
    name: 'Royal Dusk',
    backgroundImage: 'linear-gradient(to right top, #a6679d, #455779, #2f4858)',
    textColor: '#f3f6fa',
    mutedTextColor: '#aeb6c1',
    maxMutedTextColor: '#d3dbe3'
  },
  {
    name: 'Minted Lake',
    backgroundImage: 'linear-gradient(to right top, #c4ffe1, #75b3b2, #426a78)',
    textColor: '#23213a',
    mutedTextColor: '#5a6b7a', // more visible
    maxMutedTextColor: '#bdbdc7'
  },
  {
    name: 'Glacier Depths',
    backgroundImage: 'linear-gradient(to right top, #c4ffe1, #99d9cb, #75b3b2, #598e97, #426a78, #2f4858)',
    textColor: '#23213a',
    mutedTextColor: '#34506a', // improved contrast
    maxMutedTextColor: '#bdbdc7'
  },
  {
    name: 'Lemonade Dream',
    backgroundImage: 'linear-gradient(to right top, #fac4ff, #ffbee8, #ffbec4, #ffca9b, #ffe07a, #f9f871)',
    textColor: '#23213a',
    mutedTextColor: '#7a7a8a',
    maxMutedTextColor: '#bdbdc7'
  },
  {
    name: 'Emerald Abyss',
    backgroundImage: 'linear-gradient(to right top, #205a13, #005a33,#00574a, #094e5d, #094e5d, #2f4858)',
    textColor: '#f3f6fa',
    mutedTextColor: '#aeb6c1',
    maxMutedTextColor: '#d3dbe3'
  },
  {
    name: 'Desert Aurora',
    backgroundImage: 'linear-gradient(90deg, rgba(255, 125, 125, 1) 0%, rgba(199, 150, 87, 1) 36%, rgba(19, 53, 92, 1) 100%)',
    textColor: '#23213a',
    mutedTextColor: '#5a6b7a', // more visible
    maxMutedTextColor: '#bdbdc7'
  }
];
