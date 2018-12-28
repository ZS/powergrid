var config = {
	"name": "Power Grid",
	"version": "0.4.0",
	"url": "https://github.com/ZS/powergrid/",
	"cols": [
	  "auto",
	  "minmax(min-content,1fr)",
	  "auto"
	],
	"rows": [
	  "auto",
	  "minmax(min-content,1fr)",
	  "auto"
	],
	"cells": [
	  {
		"text": "Header",
		"colSpan": 3,
		"col": 1,
		"row": 1,
		"align": "stretch"
	  },
	  {
		"text": "Nav",
		"col": 1,
		"row": 2
	  },
	  {
		"text": "Body",
		"col": 2,
		"row": 2
	  },
	  {
		"text": "Aside",
		"col": 3,
		"row": 2
	  },
	  {
    	"text": "Footer",
        "col": 1,
        "row": 3,
        "colSpan": 3
	  }
	],
	"prefix": "pg-"
}