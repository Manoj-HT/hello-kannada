import { Routes } from '@angular/router';
import { ChapterComponent } from './chapter/chapter.component';
import { InteractiveComponent } from './topic/interactive/interactive.component';
import { MaterialComponent } from './topic/material/material.component';
import { BookComponent } from './book/book.component';

export const routes: Routes = [
    {
        path: 'book',
        component: BookComponent
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
                component: InteractiveComponent
            },
            {
                path: 'topic/:topicId',
                component: MaterialComponent
            },
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
