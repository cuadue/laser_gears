function to_rect(cx, cy, radius, angle) {
    var rads = angle * 180 / Math.PI
    return [cx + radius * Math.cos(rads), cy + radius * Math.sin(rads)]
}
Raphael.prototype.arc = function(x, y, radius, start_angle, end_angle) {
    var start_rad = start_angle * Math.PI / 180,
        end_rad = end_angle* Math.PI / 180,
        start_x = x + radius * Math.cos(start_rad),
        start_y = y + radius * Math.sin(start_rad),
        end_x = x + radius * Math.cos(end_rad),
        end_y = y + radius * Math.sin(end_rad)

    //this.radial_line(x, y, start_angle, 0, radius)
    //this.radial_line(x, y, end_angle, 0, radius)

    console.log('arc from', start_angle, 'to', end_angle, 'is', end_angle - start_angle)
    
    // sweep-flag is 1 because we're working clockwise
    return this.path(['M', start_x, start_y, 
                      'A', radius, radius, 0, 0, 1, end_x, end_y])
}

Raphael.prototype.radial_line = function(x, y, angle, start_r, end_r) {
    var rad = angle * Math.PI / 180,
        start_x = x + start_r * Math.cos(rad),
        start_y = y + start_r * Math.sin(rad),
        end_x = x + end_r * Math.cos(rad),
        end_y = y + end_r * Math.sin(rad)
    return this.path(['M', start_x, start_y, 'L', end_x, end_y])
}

function hypot(x, y) { return Math.sqrt(x * x + y * y) }
function map(iter, fn) {
    var result = [],
        l = iter.length
    for (var i = 0; i < l; i++) {
        result[i] = fn(iter[i])
    }
    return result
}

function involute(a, t) {
    var c = Math.cos(t), s = Math.sin(t)
    return [a * (c + t * s), a * (s - t * c)]
}

function involute_curve(a, stop_radius, step) {
    // From http://en.wikipedia.org/wiki/Involute
    // The base circle has radius a:
    // In rectangular coordinates with parameter t:
    //      x(t) = a * (cos(t) + t * sin(t))
    //      y(t) = a * (sin(t) - t * cos(t))
    // Computes a involute of a circle with radius a. Returns a list of 
    // {x: x , y: y} from angle 0 until whatever angle produces 
    // the radius stop_radius

    var result = [],
        stop_r2 = stop_radius * stop_radius

    for (var x = 0, y = 0, t = 0; x*x + y*y <= stop_r2; t += step) {
        // minus a to translate the result to the origin
        var i = involute(a, t)
        x = i[0]
        y = i[1]
        result.push(['L', x - a, y])
    }

    // SVG requires the first instruction to be a Move
    result[0][0] = 'M'

    return result
}

function involute_intersect_angle(involute_r, curve) {
    // Returns the angle of the last data point in the above data structure.
    // It's kind of ugly to require the involute radius but there's no real way
    // to find it from the curve data.
    var p = curve[curve.length-1]
    return Math.atan2(p[2], p[1] + involute_r) * 180 / Math.PI
}

function draw_gear(R, opts) {
    opts = {
        root_r: 90,
        clearance_r: 95,
        pitch_r: 100,
        addendum_r: 120,
        num_teeth: 20,
        gutter_angle: 8
    }

    // Compute the involute once. We'll use this in several places
    var inv = involute_curve(opts.pitch_r, opts.addendum_r, 1e-3)
    var intersect_angle = involute_intersect_angle(opts.pitch_r, inv)
    console.log('intersect angle', intersect_angle)

    // Guide hole for your drill of choice
    R.circle(0, 0, opts.root_r/100)

    var tooth_sweep = 360 / opts.num_teeth

    for (var i = 0; i < opts.num_teeth; i++) {
        var angle = i * 360 / opts.num_teeth

        // From the clearance surface to the start of the involute
        R.radial_line(0, 0, angle, opts.pitch_r, opts.root_r)

        // Extending involute
        R.path(inv).rotate(angle, 0, 0).translate(opts.pitch_r)

        var start_outer_angle = angle + intersect_angle

        // Outer surface
        var surface_angle = tooth_sweep - 2 * intersect_angle - opts.gutter_angle,
            end_outer_angle = start_outer_angle + surface_angle
        console.log(surface_angle)
        R.arc(0, 0, opts.addendum_r, start_outer_angle, end_outer_angle)

        // Retracting involute
        // Negative angle because the inverted scale effectively inverts the
        // rotation matrix
        R.path(inv).scale(1, -1, 0, 0).rotate(
             -end_outer_angle - intersect_angle, 0, 0).translate(opts.pitch_r)

        // From the end of retracting involute to clearance radius
        R.radial_line(0, 0, end_outer_angle + intersect_angle,
            opts.root_r, opts.pitch_r)

        // Root surface
        var start_root_angle = end_outer_angle + intersect_angle
        R.arc(0, 0, opts.root_r, start_root_angle,
            start_root_angle + opts.gutter_angle)
    }
}

var width = 600, height = 400
Raphael('holder', width, height, function() {
    this.setViewBox(-width / 2, -height / 2, width, height)
    draw_gear(this, width, height)
})

