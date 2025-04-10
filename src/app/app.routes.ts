import { Routes } from '@angular/router';
import { RootLayoutComponent } from './root-layout/root-layout.component';
import { ChapterComponent } from './chapter/chapter.component';
import { TopicComponent } from './topic/topic.component';

export const routes: Routes = [
    {
        path: 'book',
        component: RootLayoutComponent
    },
    {
        path: 'chapter/:id',
        component: ChapterComponent,
    },
    {
        path: 'chapter/:chapterId',
        children: [
            {
                path: 'topic/:topicId',
                component: TopicComponent
            }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'book'
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'book'
    },
];
