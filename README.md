**Laser Gears** generates simple circular involute gears in 2d to be cut by a
laser printer. It aims to be fast, simple, and stand alone. 

It depends on [Raphael.js](http://raphaeljs.com) to generate the SVG, which
can conveniently be displayed in a browser. Ideally this means we can
extract an SVG document from the very image displayed in the browser, but that
piece of tech isn't built yet and it doesn't appear to be entirely
straight-forward.

The originator of this project has zero mechanical engineering background, but
based upon very limited experience, these things were difficult:

* Existing tools are slow or embedded into CAD applications, making the process
  opaque and complicated.
* Relative sizing of the gears was not preserved. This is easily fixed by
  placing all the gears on one page.
* To account for laser tolerance is impractical.

# Mechanical engineering references
* [Lucas](http://lucaswhipple.com/)
* [Carter Tools](http://cartertools.com/involute.html)
* [Involute Gear Basic](http://www.scribd.com/doc/17561287/Involute-Gear-Basic)
* [Design of Nonstandard Gears](http://www.scribd.com/doc/79335761/Design-of-Nonstandard-Gears)

[MIT Licensed](http://www.opensource.org/licenses/mit-license.php)

