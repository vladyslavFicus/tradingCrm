###Simple text filter:

```html
<FilterItem label="Query" size="small" type="input" default>
  <FilterField
     id="query-field-id"
     name="query"
     type="text"
     placeholder="Some query string..."
  />
</FilterItem>
```


###Range text filter:

```html
<FilterItem label="Query" size="small" type="range:input" default>
  <FilterField
     id="query-from-field-id"
     name="from"
     type="text"
  />
  <FilterField
     id="query-to-field-id"
     name="to"
     type="text"
  />
</FilterItem>
```
