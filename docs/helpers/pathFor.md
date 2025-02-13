### `pathFor` Template Helper

Used to build a path to your route. First parameter can be either the path definition or name you assigned to the route. After that you can pass the params needed to construct the path. Query parameters can be passed with the `query` parameter. Hash is supported via `hash` parameter.

```handlebars
<a href="{{pathFor '/post/:id' id=_id}}">Link to post</a>
<a href="{{pathFor 'postRouteName' id=_id}}">Link to post</a>
<a href="{{pathFor '/post/:id/comments/:cid' id=_id cid=comment._id}}">Link to comment in post</a>
<a href="{{pathFor '/post/:id/comments/:cid' id=_id hash=comment._id}}">Jump to comment</a>
<a href="{{pathFor '/post/:id/comments/:cid' id=_id cid=comment._id query='back=yes&more=true'}}">Link to comment in post with query params</a>
```
