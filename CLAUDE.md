# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HTML5 educational tower defense ("知识大战难题") — Plants vs. Zombies-style gameplay where each plant placement requires answering a subject-based quiz question. Vanilla JavaScript ES Modules + HTML5 Canvas + Tailwind CSS (CDN). No build step, no npm, no dependencies.

**To run:** ES Modules require an HTTP origin — `file://` is blocked by Chrome/Edge. Start a local server:

```bash
cd /Users/zq/Desktop/PVZ/game && python3 -m http.server 8090
# then open http://localhost:8090/
```

## File layout

```
game/
├── index.html              ~135 行  DOM 骨架，仅引用 styles.css 和 src/main.js (type=module)
├── styles.css              ~211 行  全部样式
├── The_Last_Ledger.mp3              BGM 资源
├── code.html.bak / game.js.bak      Phase 1/2 前的快照（安全网，行为正确后可删）
└── src/
    ├── main.js                      入口 + 启动编排（initGame, bootstrap）
    ├── config.js                    CFG 常量（运行时 CFG.scale 由 canvas.js 写入）
    ├── state.js                     唯一可变状态来源 + 受控修改函数
    ├── actions.js                   跨层动作（endGame：set state + show end screen）
    ├── data/
    │   ├── plants.js                PLANTS_BASE
    │   └── quiz.js                  QUIZ + SUBJECT_NAMES
    ├── entities/                    模型层（无 DOM）
    │   ├── plant.js                 createPlant + tickPlant (type 分支)
    │   ├── zombie.js                createZombie + tickZombie (含 endGame 触发)
    │   ├── projectile.js            createProjectile + tickProjectile
    │   ├── particle.js              spawnParticles + tickParticle
    │   └── energy-orb.js            spawnEnergyOrb + tickEnergyOrb
    ├── systems/                     引擎层
    │   ├── canvas.js                initCanvas / getCanvas / getCtx + resize
    │   ├── audio.js                 SFX (Web Audio) + BGM (HTMLAudioElement)
    │   ├── render.js                render() — 全部 Canvas 绘制
    │   ├── update.js                update(dt) — 编排各 entity 的 filter+tick
    │   ├── loop.js                  startLoop() — rAF 循环
    │   ├── wave.js                  scheduleFirstWave / spawnWave + 难度公式（纯函数）
    │   └── input.js                 attachInput() — canvas click → 放置植物
    └── ui/                          视图层（DOM 操作）
        ├── screens.js               start/game/end 屏幕切换 + waveAlert
        ├── hud.js                   updateHud + togglePause + 顶栏按钮
        ├── cards.js                 renderCards / updateCards
        └── quiz-modal.js            openQuiz + 计时器 (回调式)
```

## 分层与依赖方向

```
                        main.js (orchestrator)
                            │
       ┌────────────┬───────┴──────┬──────────────┐
       ▼            ▼              ▼              ▼
    config       state/         systems/         ui/
                actions          loop, update    cards,
                                 wave, input,    hud, quiz-modal,
                                 audio, canvas,  screens
                                 render
                                    │
                                    ▼
                                entities/
                            plant, zombie, projectile,
                            particle, energy-orb
                                    │
                                    ▼
                                  data/
                              plants, quiz
```

依赖只能向下流。**entities 严禁碰 DOM**，是纯模型；**data 是叶子**，无任何 import；**ui 是唯一允许 `getElementById` 的地方**（除 `canvas.js` / `audio.js` / `input.js` 这几个明确的 DOM 适配器外）。

## 关键架构契约

### 1. State 修改唯一入口
`state.js` 导出 `state` 对象（直读）+ 一组受控 setter（`addEnergy`、`addPlant`、`setGridCell` 等）。**任何模块都不应直接写 `state.X = ...`**——一律走 setter。读取可直接用 `state.X`。

### 2. 谁触发 `endGame`
- 经典模式第 5 波结束 → `wave.js` 调 `endGame(true)`
- 僵尸越过左边界 → `zombie.js` 调 `endGame(false)`
- 都通过 `actions.js`，避免循环依赖（`zombie ↔ ui/screens` 不直接相连）

### 3. UI 刷新时机
`updateHud()` 每帧由 `loop.js` 调用一次（成本极低）；改变能量/分数/选中态的"立即反馈"路径（input.js 放置成功、quiz 答对、wave 增加）也会显式调 `updateHud()`，避免 1 帧延迟。

### 4. 答题 → 放置链路
`cards.js.renderCards(onPick)` ← `main.js` 提供 `onPick`，内部 → `openQuiz(subject, { onCorrect, onFail })` 用回调式，不耦合具体业务。`onCorrect` 保留 `selectedPlant`，`onFail` 清空。`input.js.handleCanvasClick` 检测 `state.selectedPlant` 并放置。

### 5. 内联事件已全部消除
HTML 不再有 `onclick=`/`oninput=`。所有按钮在 `bootstrap()` (main.js) / `attachHudButtons()` (hud.js) 里用 `addEventListener` 绑定。新加按钮 = 加 `id`，加 `addEventListener`。

## Conventions when editing

- **加植物**：append `data/plants.js`；在 `entities/plant.js.tickPlant` 的 type 分支里加行为；在 `data/quiz.js.QUIZ` 加题目；如果颜色不在 styles.css 的 `:root`，加一个 `--xxx` 变量
- **改难度**：优先改 `wave.js` 的 `zombieCountForWave`/`zombieBaseHpForWave`（纯函数，可单测）或 `config.js.CFG.SCALE`/`ZOMBIE_HP_SCALE`，不要直接改 `PLANTS_BASE`
- **画布坐标**：plant `x`/`y` 和 zombie `x` 都是**未缩放**像素；只有 `render.js` 通过 `ctx.scale(CFG.scale, ...)` 应用缩放。游戏逻辑里**禁止**乘 `CFG.scale`
- **音效**：通过 `import { playPlantSfx } from '.../systems/audio.js'`，不要直接操作 `AudioContext`
