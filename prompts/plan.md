---
description: 구현 전 계획 수립 — PLAN.md 작성
argument-hint: "<focus>"
---

Analyze the task and produce an implementation plan. Do not implement anything —
`PLAN.md` is the ONLY file you may create or modify.

## Analysis

1. Read the relevant files in full before drawing conclusions.
2. Search for related code and existing patterns (grep/find).
3. Identify risks, edge cases, and dependencies.
4. If anything material is ambiguous, ask me before finalizing the plan.

## Write PLAN.md exactly in this structure

# Plan: <short title>

## Goal

<one paragraph — what and why>

## Approach

<key design decisions and trade-offs>

## Steps

- [ ] 1. <small, individually verifiable step>
- [ ] 2. ...

## Files

<files to create/modify, one per line, with intent>

## Verification

<how to verify — tests, commands, expected results>

## Open questions

<decisions you need from me, or "None">

Focus: ${@:-the current task}
