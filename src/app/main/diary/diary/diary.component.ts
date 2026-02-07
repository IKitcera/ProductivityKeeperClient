import { Component } from '@angular/core';
import {DatePipe} from "@angular/common";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import {MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent {

  public items = [
    {
      id: 12,
      title: 'My thoughts',
      content: `Imagine I had something to say today. The morning was quiet, and I spent some time reflecting on my goals.

Later, I took a walk and felt grateful for the small moments that make life meaningful.`,
      createdAt: new Date(),
      imageUrl: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE='
    },
    {
      id: 11,
      title: 'Rough Day',
      content: `The day was so awful that I have nothing to add. I was so frustrated and tired.

Still, I managed to push through and finish my tasks, even though it felt impossible at times.`,
      createdAt: new Date()
    },
    {
      id: 10,
      title: 'Cuteee',
      content: `I saw a cute dog! Now I want to get a dog. It was playful and made me smile.

Maybe someday I'll have a pet to keep me company during long evenings.`,
      createdAt: new Date()
    },
    {
      id: 9,
      title: 'Productive Morning',
      content: `Woke up early and managed to get a lot done before noon. The sense of accomplishment was energizing.

I hope I can keep this momentum going for the rest of the week.`,
      createdAt: new Date()
    },
    {
      id: 8,
      title: 'Unexpected Call',
      content: `Received a call from an old friend. We talked for hours, catching up on life and reminiscing about the past.

It reminded me how important it is to nurture relationships.`,
      createdAt: new Date()
    },
    {
      id: 7,
      title: 'Rainy Evening',
      content: `The rain started in the afternoon and continued into the evening. I stayed inside, reading and listening to music.

Sometimes, rainy days are perfect for slowing down and recharging.`,
      createdAt: new Date()
    },
    {
      id: 6,
      title: 'New Recipe',
      content: `Tried a new recipe for dinner. It turned out better than expected!

Cooking is becoming a relaxing hobby for me.`,
      createdAt: new Date()
    },
    {
      id: 5,
      title: 'Small Victory',
      content: `Managed to solve a tricky problem at work. It felt great to finally figure it out.

Celebrated with a cup of coffee and a short break.`,
      createdAt: new Date()
    },
    {
      id: 4,
      title: 'Evening Walk',
      content: `Went for a walk after dinner. The air was cool and refreshing.

Walking helps me clear my mind and reflect on the day.`,
      createdAt: new Date()
    },
    {
      id: 3,
      title: 'Weekend Plans',
      content: `Looking forward to the weekend. Planning to visit a new place and try some local food.

Excited for a change of scenery and new experiences.`,
      createdAt: new Date()
    }
  ];

  public gradients: DiaryViewConfig[] = [
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

  public diaryViewConfig: DiaryViewConfig = this.gradients[5];
}
interface DiaryViewConfig {
  name: string;
  backgroundImage: string;
  textColor?: string;
  mutedTextColor?: string;
  maxMutedTextColor?: string;
}
