module.exports = function(field, tilesize, dimensions, offset) {
  dimensions = dimensions || [ 
    Math.sqrt(field.length) >> 0
  , Math.sqrt(field.length) >> 0
  ] 

  offset = offset || [
    0
  , 0
  , 0
  ]

  field = typeof field === 'function' ? field : function(x, y) {
    return this[x + y * dimensions[1]]
  }.bind(field) 

  var coords = [0, 0]
  var move = [0, 0]

  return collide

  function collide(box, vec, oncollision) {
    if(vec[0] === 0 && vec[1] === 0) return

    move[0] = vec[0]
    move[1] = vec[1]

    // collide x, then y
    collideaxis(0)
    collideaxis(1)

    function collideaxis(axis) {
      var posi = vec[axis] > 0
        , leading = posi ? box[axis] + box[axis+2] : box[axis]
        , dir = posi ? 1 : -1
        , opposite_axis = +!axis
        , start = Math.floor(box[opposite_axis] / tilesize)|0
        , end = Math.ceil((box[opposite_axis] + box[opposite_axis+2]) / tilesize)|0
        , tilespace = Math.floor(leading / tilesize)|0
        , tilespace_end = (Math.floor((leading + vec[axis]) / tilesize)|0) + dir
        , done = false
        , edge_vector
        , edge
        , tile

      // loop from the current tile coord to the dest tile coord
      //    -> loop on the opposite axis to get the other candidates
      //      -> if `oncollision` return `true` we've hit something and
      //         should break out of the loops entirely.
      for(var i = tilespace; !done && i !== tilespace_end; i += dir) {
        if(i < offset[axis] || i >= dimensions[axis]) continue
        for(var j = start; j !== end; ++j) {
          if(j < offset[opposite_axis] || j >= dimensions[opposite_axis]) continue

          coords[axis] = i
          coords[opposite_axis] = j
          tile = field.apply(field, coords)

          if(tile === undefined) continue

          edge = dir > 0 ? i * tilesize : (i + 1) * tilesize
          edge_vector = edge - leading

          if(oncollision(axis, dir, tile, coords)) {
            done = true
            move[axis] = edge_vector
            break
          } 
        }
      }
    }

    return move
  }  
}
