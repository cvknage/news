import { app } from '../../app';
import { NewsItem } from './news-model';
import * as firebase from 'firebase';
import * as _ from 'lodash';

export class NewsService {
    private topStories: any;
    public stories: { [key: string]: NewsItem } = {};

    constructor($firebaseArray: any, $firebaseObject: any, $http: ng.IHttpService) {
        let hackerNews = firebase.initializeApp({ databaseURL: 'https://hacker-news.firebaseio.com' });
        let hackerNewsRef = hackerNews.database().ref('/v0');
        let topStoriesRef = hackerNewsRef.child('topstories').limitToFirst(10);

        // Create a firebaseArray that automatically syncs when topstories in db change
        this.topStories = $firebaseArray(topStoriesRef);

        // Watch on topStories to get notification on change events
        this.topStories.$watch((element: any) => {
            let elementKey = element.key;
            let storyId = this.topStories[elementKey].$value;
            let storyRef = hackerNewsRef.child('item').child(storyId);

            // Create a firebaseObject that updates async
            let story = $firebaseObject(storyRef);
            story.$loaded().then(() => {
                let yql = '//query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20html%20WHERE%20url=%27'
                    + encodeURIComponent(story.url)
                    + '%27%20AND%20xpath=%27descendant-or-self::meta%27&format=json';

                $http.get(yql).success((data: any) => {
                    let results = data.query.results;
                    if (results) {
                        let meta = results.meta;
                        let ogImage: any = _.find(meta, ['property', 'og:image']);
                        if (ogImage && ogImage.content) {
                            story.imgUrl = ogImage.content;
                        }
                    }
                    let yqlImg = '//query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20html%20WHERE%20url%3D%27'
                        + encodeURIComponent(story.url)
                        + '%27%20AND%20xpath%3D%27descendant-or-self%3A%3Aimg%27&format=json';
                    $http.get(yqlImg).success((data: any) => {
                        let results = data.query.results;
                        if (!story.imgUrl && results && results.img[0]) {
                            let imgSrc = results.img[0].src;
                            let ahref = document.createElement('a');
                            ahref.href = story.url;
                            if (/^(http|\/\/).*(gif|jpeg|jpg|png)$/.test(imgSrc)) {
                                story.imgUrl = imgSrc;
                            } else if (/.*(gif|jpeg|jpg|png)$/.test(imgSrc)) {
                                story.imgUrl = '//' + ahref.hostname + imgSrc;
                            }
                        }
                        if (!story.imgUrl && /github\.(io|com)/.test(story.url)) {
                            console.log('THATs GITHUB');
                            story.imgUrl = '//assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png';
                        }
                        // I give up
                        if (!story.imgUrl) {
                            console.log('no good image, using default');
                            story.imgUrl = 'http://www.lifeprint.com/asl101/signjpegs/w/what.h1.jpg';
                        }
                        this.stories[elementKey] = new NewsItem(story);
                    });
                });
            });
        });
    }
}

app.service('newsService', NewsService);
