export class NewsItem {
    public id: Number;
    public title: string;
    public author: string;
    public commentsHref: string;
    public storyHref: string;
    public imageHref: string;
    public pubDate: Date;

    constructor(story: any) {
        this.id = story.id;
        this.title = story.title;
        this.author = story.by;
        this.commentsHref = 'https://news.ycombinator.com/item?id=' + story.id;
        this.storyHref = story.url;
        this.pubDate = new Date(story.time * 1000);
        this.imageHref = story.imgUrl;
    }
}
