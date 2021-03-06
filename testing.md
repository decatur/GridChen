## Invalid Cell Values
The input value is honored and stored, even if it does not comply with the schema.
  
## Inactive cell
The content is displayed according the formatter.

## Active Cell
If a cell is clicked, this cell becomes active. There is at most one active cell.

## ACTIVE mode
Initially, the active cell is in ACTIVE mode. The content is displayed according the formatter.

In ACTIVE or and in INPUT mode, we can navigate from that cell to adjoining cells (`ArrowKeys`, `Enter`=`ArrowDown`,
Shift-`Enter`=`ArrowUp`, `Tab`=`ArrowRight`, Shift-`Tab`=`ArrowLeft`),
which in turn become the active cell. Likewise, we can navigate by page (PageKeys). A page has the size of the view port.
Horizontal navigation stops at the first and last column.

The Delete key will delete the active cell content.

## Scroll Navigation
Vertical navigation will trigger a viewport scroll if the active cell would fall of the view port.
During scroll navigation (`Arrow` or `Page`), the active cell is **always** fixed in the viewport.

## INPUT mode
The active cell enters input mode if the cell receives text input.
The `Escape` key has no meaning.

## EDIT mode
Like in INPUT mode, the cell receives text input. However, the ArrowKeys no longer change cells, but move the caret.
The `Delete` key will delete the character after the caret.
The `Enter`, Shift-`Enter`, `Tab` and Shift-`Tab` keys have the same meaning is in INPUT mode, the PageKeys are ignored.
The Escape key will exit EDIT mode and enter ACTIVE mode.

## In INPUT and EDIT mode
* the cell content is displayed as the raw value from the model.
* after navigating away from the cell, the change is pushed to the model.

## Expanding Matrix
Enter data past the last row or use the "Insert Row Above" button.

## Selection
There is at most one selection. The selection always contains the active cell. The selection is always rectangular.
The selection can be expanded to multiple cells by Shift-`LeftClick` another cell. The active cell stays the same.
At no point we tolerate DOM text node selection as it is confusing.
The `Delete` key will delete the selections content.

## Copy&Paste
We support only text/plain as tab-separated values.
Ctrl-`KeyV` pastes the clipboard to cells, tolerating both `\r\n` and `\n` line endings.
Ctrl-`KeyC` copies the selected cells to the clipboard with `\n` line endings.
 
## Model
A rectangular matrix as an array of equally sized rows.
Missing rows are allowed and are indicated by undefined. Missing cell values are indicated by
undefined.

# Design

## Goals
Very lightweight but fast web component with strict MS-Excel adherence to user experience. 
Non-fancy but enterprise capable, time series.

## Language
es7 (modules, promises, async). No Typescript to keep it simple.

Default action (focus, tabbing), CSS 

## DOM-Layout

0. Header row of `HTMLSpanElement`s
1. Absolute positioned NxM-matrix (the viewport) of `HTMLSpanElement`s
2. One HTMLInputElement for text input popping up over active cell.
3. One HTMLInputElement with type=range as scroll bar

Any scroll action (change of viewport offset) will re-render the viewport.
The selection is marked by setting the background-color of the selected span elements.

We use tabIndex to make cellParent focusable and therefore able to receive keyboard events.
This is more safe than contentEditable, where you have to prevent user from directly manipulating the DOM
(for example context menu->insert from clipboard).

### Alternative Layouts
* canvas
    * Cons: Needs much more code for rendering and event handling; Pixel-graphic.
* svg
    * Cons: User input
* HTMLTableElement -> dash datagrid
* HTMLInputElement matrix
    * Cons: Cannot have format mode.
    * Pros: Very HTML-ish
    
### cells: input vs span
input pro:
* semantically correct
* more natural handling of clipboard events
span pro:
* allows rich formatting, for example links
* easier handling of cell modes (FORMAT, EDIT, INPUT)

### editable vs popup input
editable pro
* must not handle display, location and focus of input element
popup input pro
* semantically correct
* no need to safeguard the integrity of the dom (user injects dom fragment via context menu->insert) 

## Event-Layout

Tab navigation is done explicitly by our code, not by the default behavior.
TODO: Check if this is possible by setting tabIndex on span elements.

Watch for multiple actions, for example onclick -> onclick -> ondblclick or onmousedown -> onclick. 

# Browser Support
Tested only with Chrome Version 71.0

# API Design

We tries to emulate the structure of the JavaScript API for Office, for example 
[Excel.Range](https://docs.microsoft.com/en-us/javascript/api/excel/excel.range).



# Test Plan

1. Open http://localhost:63342/GridChen/demo1.html
-> a grid with one header and 1000 data rows is displayed.

2. Change location hash to rowcount=10
-> a grid with one header and 10 data rows is displayed

3. Click any cell
-> Cell is active

4. Type 123`Enter`
-> Cell contains value 123

1. DoubleClick cell and replace 2 by 4 then `Enter`
-> Cell contains value 143

1. With mouse-down/move/up select multiple cells 
-> Selection is highlighted

1. Click any cell
-> Selection is revoked

1. Scroll active cell out of view, then create input -> active cell scrolls into view.
Note: Currently we only support dblclick to enter edit mode. So it it not possible to enter edit mode on a out of view cell.

1. Pull mouse-wheel -> scroll down; Push -> scroll up

1. Mouse-Wheel past the first row -> not possible

1. Make a Click-Selection-Expand. -> The active cell should not change.

1. Check trimming

1. Edit Mode shows raw data: Edit a numerical cell with a value with more digits than displayed -> All digits are shown.

1. Edit cell and click other cell -> Edited cell must return to display mode.

1. Same for clicking slider or clicking outside of GridChen component.

1. Copy&Paste date must result in same value

1. Grid looses focus -> no active cell, no selection

1. Sorting does not change active cell nor selection

1. Editing active cell when outside viewport is possible -> The active cell must scroll into view.

1. Clicking editor should move caret.

1. Expanding selection (both mouse and keyboard) must not change active cell.

1. In EDIT mode, Shift-Enter enters moves active cell up in ACTIVE mode.

1. Escape must exist edit and input mode

1. EDIT mode must show the **raw** data, not the formatted value.

1. On load of the grid, no active cell or selection must show.

1. Header must show sort direction, if any. 

1. Sort must toggle. Only one column must show sort direction.

1. Bluring grid in EDIT mode must exit editor (read only or not), active cell and selection.

1.  WheelScroll with selected GridChen must not scroll any surrounding HTML element.

1. Ctrl-WheelScroll must zoom (default behaviour)

1. If paste target selection is multiple of source, then tile target with source, otherwise just paste source

## Multiple Grids
Check only one grid can have focused cell and selection.
Copy from one grid and paste to other.
Scroll both grids.
Edit both grids.

