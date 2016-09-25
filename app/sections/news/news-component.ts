import { app } from '../../app';
import { NewsItem } from './news-model';
import { NewsService } from './news-service';

class NewsController {
    public tops: {[key: string]: NewsItem};

    constructor(newsService: NewsService) {
        this.tops = newsService.stories;
    }

    public getTimeAgo(pubDate: Date): string {
        let now = new Date();
        let agoInMillis = now.getTime() - pubDate.getTime();
        let agoInMins = Math.round(agoInMillis / (1000 * 60));
        return agoInMins.toString();
    }
}

app.component('newsComponent', {
    templateUrl: 'sections/news/news-component.html',
    controller: NewsController
});
