---
title: 'charityCode: Backend Setup'
description: Setting up the Python backend and connecting to LeetCode
author: Adam Aubry
date: '2026-03-06'
---

## Goal

Get a working connection to LeetCode that prints solved problem stats in the terminal.

## Stack

- Python 3 with a virtual environment (`venv`)
- `requests` library for HTTP calls
- LeetCode's public GraphQL API (`https://leetcode.com/graphql`)

## Project Structure

```
charityCode/
├── venv/
├── services/
│   └── leetcode/
│       └── __init__.py   # GraphQL queries + fetch functions
├── main.py               # Entry point, prints stats to terminal
├── requirements.txt
└── .gitignore
```

## Setup

```bash
python3 -m venv venv
venv/bin/pip install requests
```

## Running

```bash
venv/bin/python main.py
```

## Result

```
========================================
  LeetCode Stats for: AdumbRock
========================================
  Easy   solved: 19
  Medium solved: 4
  Hard   solved: 0
  Total  solved: 23
========================================

  Recent solved problems:
    [2026-02-12] Design Browser History
    [2026-02-11] Design Linked List
    [2026-02-09] Merge Two Sorted Lists
    ...
```

## Next Steps

- Add a deadline and problem goal count
- Calculate how many problems are left to solve
- Wire up a donation trigger if the deadline is missed
