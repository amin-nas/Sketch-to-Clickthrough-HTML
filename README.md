>It works, but consider this as a work in progress :)

# Sketch-to-Clickthrough-HTML

Convert your artboards into HTML pages.


## Download & Installation

1. Download the plugin
2. Double click "Sketch to HTML.sketchplugin". It will be automatically installed into Sketch.



## OPTIONS

### Link a layer to another artboard

1. Select any layer of your artboard
2. Name the layer with [linkto:artboard_name] Layer_Name

This will add an HTML link tag on top of that layer when it's exported.
Note that the layer has to be a top-level layer, meaning it cannot be nested inside another layer.


### Fix a layer position
In case you need to have fixed top nav, fixed footer, fixed sidebar, ...

1. Select any layer of your artboard
2. Name the layer with [fixed:position] Layer_Name

Position can be one of the following:
- top
- bottom
- left
- right

Note that the layer has to be a top-level layer, meaning it cannot be nested inside another layer.


## License

**The MIT License (MIT)**

Copyright (c) 2014 Marcos Vidal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
