# collide-2d-aabb-tilemap

> Determines whether a moving axis-aligned bounding box collides with a tilemap, and prevents intersection.


## Example

[Here's a playable demo.](http://didact.us/collide-2d-tilemap/)

Example usage:

```javascript
var collideAabbTilemap = require('collide-2d-aabb-tilemap')

var tilemap = [
    [ 0, 0, 0, 1 ],
    [ 1, 0, 0, 1 ],
    [ 1, 0, 0, 1 ],
    [ 1, 1, 1, 1 ]
]

// (0,0) - (16,16)
var player = [0, 0, 16, 16]

// collideAabbTilemap(field, size of tile in pixels, [width, height])
collide = collideAabbTilemap(my_tilemap, 32, [4, 4])

my_game_event_loop(function(dt) {
  var vec = get_player_input() * dt 

  collide(player, vec, function(moveAxis, moveDir, tileIdx, tileCoords) {
    // true => solid
    return tileIdx > 0
  })
})

```

The algorithm used is taken from [this
article](http://higherorderfun.com/blog/2012/05/20/the-guide-to-implementing-2d-platformers/).
Detection and correction is applied on each X and Y axis separately.


## Usage

### var collide = collideAabbTilemap(array, tilesize[, dimensions])

Produces a `collide(aabb, vec2, oncollide)` function.

`array` may be a single-dimension array (or
[ndarray](https://www.npmjs.com/package/ndarray)) of integers **OR** a function
of the form `fn(tileX, tileY) -> integer`.

`tilesize` are the pixel dimensions of a tile. 

`dimensions` is a size 2 array of integers, `[width, height]`. If it is not
provided, the map will be assumed to be square.

### var offset = collide(aabb, moveDelta, onCollide)

Attempt to advance `aabb` by `moveDelta` against the aforementioned `tilemap`.
Non-destructive.

If there is no collision, `offset == moveDelta`. Otherwise, it will be shorter
in one or both axes.

`aabb` is assumed to be a size 4 array of the form `[x, y, width, height]`.

`moveDelta` is assumed to be a `gl-matrix`-style `vec2` or `[x, y]`.

`onCollide` is a callback function, taking the following arguments:

* `moveAxis`: an integer representing the axis of movement. `0` (X) or `1` (Y).
* `tileIdx`: the tile integer data of the tile a candidate collision has been detected against.
* `tileCoords`: a size 2 array of tile coordinates.

If the callback returns a truthy value, the tile will be treated as solid, and
no further tiles will be checked along this axis.


## License

MIT
