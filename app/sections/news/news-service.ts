import { app } from '../../app';
import { NewsItem } from './news-model';
import * as firebase from 'firebase';
import * as _ from 'lodash';

export class NewsService {
    private topStories: any;
    public stories: { [key: string]: NewsItem } = {};

    constructor($firebaseArray: any, $firebaseObject: any, private $http: ng.IHttpService, private $q: ng.IQService) {
        let hackerNews = firebase.initializeApp({ databaseURL: 'https://hacker-news.firebaseio.com' });
        let hackerNewsRef = hackerNews.database().ref('/v0');
        let topStoriesRef = hackerNewsRef.child('topstories').limitToFirst(50);

        // Create a firebaseArray that automatically syncs when topstories in db change
        this.topStories = $firebaseArray(topStoriesRef);
        this.topStories.$watch((element: any) => {
            this.addImagesToStories(element, $firebaseObject, hackerNewsRef);
        });
    }

    private addImagesToStories(element: any, $firebaseObject: any, hackerNewsRef: firebase.database.Reference) {
        let elementKey = element.key;
        let storyId = this.topStories[elementKey].$value;
        let storyRef = hackerNewsRef.child('item').child(storyId);

        // Create a firebaseObject that updates async
        let story = $firebaseObject(storyRef);
        story.$loaded().then(() => {
            this.getOgImage(story).then((url: string) => {
                if (url) {
                    this.addUrl(url, story, elementKey);
                } else {
                    this.getSrcImage(story).then((url: string) => {
                        if (url) {
                            this.addUrl(url, story, elementKey);
                        } else {
                            this.useBackupImage(story, elementKey);
                        }
                    }, (error: any) => console.log);
                }
            }, (error: any) => console.log);
        });
    }

    private getOgImage(story: any): ng.IPromise<string> {
        let deferred = this.$q.defer();
        let yql = '//query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20html%20WHERE%20url=%27'
            + encodeURIComponent(story.url)
            + '%27%20AND%20xpath=%27descendant-or-self::meta%27&format=json';

        this.$http.get(yql).success((data: any) => {
            let results = data.query.results;
            if (results) {
                let meta = results.meta;
                let ogImage: any = _.find(meta, ['property', 'og:image']);
                if (ogImage && ogImage.content) {
                    deferred.resolve(ogImage.content);
                    return;
                }
            }
            deferred.resolve();
        }).error((error: any) => deferred.reject);
        return deferred.promise;
    }

    private getSrcImage(story: any): ng.IPromise<string> {
        let deferred = this.$q.defer();
        let yql = '//query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20html%20WHERE%20url%3D%27'
            + encodeURIComponent(story.url)
            + '%27%20AND%20xpath%3D%27descendant-or-self%3A%3Aimg%27&format=json';

        this.$http.get(yql).success((data: any) => {
            let results = data.query.results;
            if (results && results.img[0]) {
                let imgSrc: string = results.img[0].src;
                let ahref = document.createElement('a');
                ahref.href = story.url;
                if (/^(http|\/\/).*(gif|jpeg|jpg|png)$/.test(imgSrc)) {
                    deferred.resolve(imgSrc);
                    return;
                }
                if (/.*(gif|jpeg|jpg|png)$/.test(imgSrc)) {
                    if (imgSrc.substr(0, 1) !== '/') {
                        imgSrc = '/' + imgSrc;
                    }
                    deferred.resolve('//' + ahref.hostname + imgSrc);
                    return;
                }
            }
            deferred.resolve();
        }).error((error: any) => deferred.reject);
        return deferred.promise;
    }

    private useBackupImage(story: any, elementKey: any) {
        if (/github\.(io|com)/.test(story.url)) {
            // Github doesn't allow web crawlers
            this.addUrl('//assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png', story, elementKey);
        } else {
            // I give up
            this.addUrl('http://www.lifeprint.com/asl101/signjpegs/w/what.h1.jpg', story, elementKey);
        }
    }

    private addUrl(url: string, story: any, elementKey: any) {
        story.imgUrl = url;
        this.stories[elementKey] = new NewsItem(story);
    }
}

app.service('newsService', NewsService);
