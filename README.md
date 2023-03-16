# limit-object-size
Limits a javascript object serialized JSON size in KBytes by trimming the attributes in order of size

## Installation

```
npm i limit-object-size
```

## Usage

```
     const { limitObjectSize } = require('limit-object-size');
    const myObj = {
      prop1: "value1",
      prop2: {
        subprop1: "subvalue1",
        subprop2: {
          subsubprop2: "subsubvalue2"
        }
      },
      prop3: "value3",
      prop4: "this is a very long string and should be trimmed ?",
    };
    const maxKB = 150/1024;
    const result = limitObjectSize(myObj, maxKB);

    /* result is now :
    
    const expectedObj = {
      prop1: "value1",
      prop2: {
        subprop1: 'subvalue1',
        subprop2: {
          subsubprop2: "subsubvalue2"
        }
      },
      prop3: 'value3',
      prop4: '...',
    };
    
    */
```
