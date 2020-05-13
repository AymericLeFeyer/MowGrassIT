import React from "react";
import "./App.css";
import { useState } from "react";
import { CardMedia, makeStyles, Card, Grid } from "@material-ui/core";

import grass1 from "./res/grass1.jpg";
import grass2 from "./res/grass2.jpg";
import mower from "./res/mower.png";

export default function App() {
  const [gridSize, setGridSize] = useState([5, 5]);
  const [grid, setGrid] = useState(createGrid(gridSize));
  const [mowerPos, setMowerPos] = useState({
    x: 0,
    y: 0,
    visible: false,
  });
  const [mowers, setMowers] = useState({
    array: [
      {
        startX: 0,
        startY: 0,
        startOrientation: "Nord",
        path: [],
      },
    ],
  });

  const [currentMower, setCurrentMower] = useState(0);
  const [currentAction, setCurrentAction] = useState(0);
  const [finished, setFinished] = useState(false);

  const useStyles = makeStyles({
    cardStyle: {
      maxWidth: 345,

      boxShadow: "1px 1px 2px black",
    },
    cardMedia: {
      height: 80,
      width: 80,
    },
  });

  const classes = useStyles();

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  return (
    <div className="App">
      <h1>MowGrass-IT</h1>
      <button type="button" class="btn btn-primary">
        Récupérer le sujet
      </button>

      <GetGridSizeArea />
      <GetMowers />
      <DisplayGrid />
      <DisplayMower />
      {finished ? <EndMow /> : null}
    </div>
  );

  function createGrid(size) {
    let grid = [[]];
    for (let i = 0; i < size[0]; i++) {
      let row = [];
      for (let j = 0; j < size[1]; j++) {
        row.push({
          card: {
            x: 0,
            y: 0,
          },
          mowed: false,
        });
      }
      grid.push(row);
    }
    return grid;
  }

  function updateSizeArea(size) {
    if (size[0] > 4 && size[1] > 4) {
      if (size[0] <= 15 && size[1] <= 15) {
        setGridSize(size);
        setGrid(createGrid(size));
      } else alert("La taille doit être inférieure à 16");
    } else alert("La taille doit être supérieure à 4");
  }

  function setMowerPosition(x, y) {
    let p = mowerPos;
    p.x = x;
    p.y = y;
    setMowerPos(p);
  }

  function GetGridSizeArea() {
    const started = !(currentMower === 0 && currentAction === 0) || finished;
    return (
      <div>
        <p className="textSizeGrid">Taille de la grille : </p>
        <div class="form-group row sizeForm">
          <label for="example-number-input" class="col-2 col-form-label">
            Hauteur :
          </label>
          {started ? (
            <label class="col-form-label">{gridSize[0]}</label>
          ) : (
            <div>
              <input
                class="form-control"
                type="number"
                value={gridSize[0]}
                onChange={(e) => updateSizeArea([e.target.value, gridSize[1]])}
              />
            </div>
          )}
        </div>
        <div class="form-group row sizeForm">
          <label for="example-number-input" class="col-2 col-form-label">
            Largeur :
          </label>
          {started ? (
            <label class="col-form-label">{gridSize[1]}</label>
          ) : (
            <div>
              <input
                class="form-control"
                type="number"
                value={gridSize[1]}
                onChange={(e) => updateSizeArea([gridSize[0], e.target.value])}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  function DisplayRow(row, key) {
    return (
      <Grid container>
        {row.map((cell, key2) => {
          return (
            <Grid item>
              <Card
                className={classes.cardStyle}
                ref={(el) => {
                  if (!el) return;

                  grid[key][key2].card.x =
                    el.getBoundingClientRect().x + window.pageXOffset;
                  grid[key][key2].card.y =
                    el.getBoundingClientRect().y + window.pageYOffset;
                }}
              >
                <CardMedia
                  className={classes.cardMedia}
                  image={grid[key][key2].mowed ? grass2 : grass1}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  function DisplayGrid() {
    return (
      <div className="lawn">
        {grid.map((row, key) => {
          return DisplayRow(row, key);
        })}
      </div>
    );
  }

  function orientationToDegree(ori) {
    switch (ori) {
      case "Nord":
        return 0;
      case "Est":
        return 90;
      case "Sud":
        return 180;
      case "Ouest":
        return 270;
      default:
        return 0;
    }
  }

  function DisplayMower() {
    const orientation = orientationToDegree(
      mowers.array[currentMower].startOrientation
    );
    console.log(orientation);

    return (
      <div>
        <img
          src={mower}
          alt="mower"
          style={{
            position: "absolute",
            width: 80,
            height: 80,
            left: `${mowerPos.x}px`,
            top: `${mowerPos.y}px`,
            opacity: mowerPos.visible === true ? 1 : 0,
            transform: `rotate(${orientation}deg)`,
          }}
        />
      </div>
    );
  }

  function addMower() {
    let mow = mowers;
    mow.array.push({
      startX: 0,
      startY: 0,
      startOrientation: "Nord",
      path: [],
    });
    setMowers(mow);
    forceUpdate();
  }

  function startMow() {
    console.log(
      "operation : " + mowers.array[currentMower].path[currentAction]
    );
    mowerPos.visible = true;
    let [x, y] = [
      mowers.array[currentMower].startX,
      mowers.array[currentMower].startY,
    ];

    y = gridSize[1] - 1 - y;

    grid[y + 1][x].mowed = true;

    setMowerPosition(grid[y + 1][x].card.x, grid[y + 1][x].card.y);

    forceUpdate();
    if (finished === false) {
      console.log(currentMower, currentAction);
      if (mowers.array.length > currentMower) {
        if (mowers.array[currentMower].path.length > currentAction) {
          nextOperation(currentMower, currentAction);
          setCurrentAction(currentAction + 1);
        } else {
          if (mowers.array.length - 1 > currentMower) {
            setCurrentMower(currentMower + 1);
            setCurrentAction(0);
          } else setFinished(true);
        }
      }
    }
  }

  function nextOperation(mower, id) {
    const action = mowers.array[mower].path[id];
    if (action === "A") forward(mower);
    else {
      pivot(action, mower);
    }
  }

  function pivot(direction, mower) {
    switch (mowers.array[mower].startOrientation) {
      case "Nord":
        if (direction === "D") {
          mowers.array[mower].startOrientation = "Est";
        }
        if (direction === "G") {
          mowers.array[mower].startOrientation = "Ouest";
        }
        break;
      case "Sud":
        if (direction === "D") {
          mowers.array[mower].startOrientation = "Ouest";
        }
        if (direction === "G") {
          mowers.array[mower].startOrientation = "Est";
        }
        break;
      case "Est":
        if (direction === "D") {
          mowers.array[mower].startOrientation = "Sud";
        }
        if (direction === "G") {
          mowers.array[mower].startOrientation = "Nord";
        }
        break;
      case "Ouest":
        if (direction === "D") {
          mowers.array[mower].startOrientation = "Nord";
        }
        if (direction === "G") {
          mowers.array[mower].startOrientation = "Sud";
        }
        break;
      default:
        break;
    }
    setMowers(mowers);
  }

  function forward(mower) {
    let orientation = mowers.array[mower].startOrientation;
    if (orientation === "Nord") {
      if (mowers.array[mower].startY < gridSize[1] - 1) {
        mowers.array[mower].startY += 1;
      } else console.log("Mouvement inutile");
    }
    if (orientation === "Sud") {
      if (mowers.array[mower].startY > 0) {
        mowers.array[mower].startY -= 1;
      } else console.log("Mouvement inutile");
    }
    if (orientation === "Est") {
      if (mowers.array[mower].startX < gridSize[0] - 1) {
        mowers.array[mower].startX += 1;
      } else console.log("Mouvement inutile");
    }
    if (orientation === "Ouest") {
      if (mowers.array[mower].startX > 0) {
        mowers.array[mower].startX -= 1;
      } else console.log("Mouvement inutile");
    }
    setMowers(mowers);
  }

  function updateStartMowerPosition(pos, ori, key) {
    let mow = mowers;
    if (pos[0] >= 0 && pos[0] < gridSize[1])
      mow.array[key].startX = parseInt(pos[0]);
    else alert("La tondeuse n'est plus sur la pelouse !");
    if (pos[1] >= 0 && pos[1] < gridSize[0])
      mow.array[key].startY = parseInt(pos[1]);
    else alert("La tondeuse n'est plus sur la pelouse !");
    mow.array[key].startOrientation = ori;
    setMowers(mow);
    forceUpdate();
  }

  function updatePathMower(char, key, mode) {
    let letter = char.slice(-1);
    if (letter === "d" || letter === "D") mowers.array[key].path.push("D");
    if (letter === "g" || letter === "G") mowers.array[key].path.push("G");
    if (letter === "a" || letter === "A") mowers.array[key].path.push("A");
    setMowers(mowers);
    if (mode === 1) forceUpdate();
  }

  function DisplayMowerForms() {
    const started = !(currentMower === 0 && currentAction === 0) || finished;
    return mowers.array.map((mower, key) => {
      return (
        <div className="divMowers">
          <Grid container>
            <Grid item xs={2}>
              <p className="numMower">Tondeuse {key + 1}</p>
            </Grid>
            <Grid item xs>
              <div class="form-group row sizeForm">
                <label for="example-number-input" class="col-4 col-form-label">
                  Position X :
                </label>

                {started ? (
                  <label class="col-4 col-form-label">
                    {mowers.array[key].startX}
                  </label>
                ) : (
                  <div>
                    <input
                      class="form-control"
                      type="number"
                      value={mowers.array[key].startX}
                      onChange={(e) =>
                        updateStartMowerPosition(
                          [e.target.value, mowers.array[key].startY],
                          mowers.array[key].startOrientation,
                          key,
                          0
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </Grid>
            <Grid item xs>
              <div class="form-group row sizeForm">
                <label for="example-number-input" class="col-4 col-form-label">
                  Position Y :
                </label>

                {started ? (
                  <label class="col-4 col-form-label">
                    {mowers.array[key].startY}
                  </label>
                ) : (
                  <div>
                    <input
                      class="form-control"
                      type="number"
                      value={mowers.array[key].startY}
                      onChange={(e) =>
                        updateStartMowerPosition(
                          [mowers.array[key].startX, e.target.value],
                          mowers.array[key].startOrientation,
                          key,
                          0
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </Grid>
            <Grid item xs>
              <div class="form-group row sizeForm">
                <label for="example-number-input" class="col-4 col-form-label">
                  Orientation :
                </label>

                {started ? (
                  <label class="col-4 col-form-label">
                    {mowers.array[key].startOrientation}
                  </label>
                ) : (
                  <div>
                    <select
                      class="form-control"
                      value={mowers.array[key].startOrientation}
                      onChange={(e) =>
                        updateStartMowerPosition(
                          [mowers.array[key].startX, mowers.array[key].startY],
                          e.target.value,
                          key,
                          0
                        )
                      }
                    >
                      <option>Nord</option>
                      <option>Sud</option>
                      <option>Est</option>
                      <option>Ouest</option>
                    </select>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
          <div class="input-group mb-3">
            {started ? (
              <label class="col-form-label">
                Instructions : 
              </label>
            ) : (
              <div class="input-group-append">
                <button
                  class="btn btn-secondary"
                  type="button"
                  onClick={() => updatePathMower("D", key, 1)}
                >
                  D
                </button>
                <button
                  class="btn btn-secondary"
                  type="button"
                  onClick={() => updatePathMower("G", key, 1)}
                >
                  G
                </button>
                <button
                  class="btn btn-secondary"
                  type="button"
                  onClick={() => updatePathMower("A", key, 1)}
                >
                  A
                </button>
              </div>
            )}
            {started ? (
              <label class="col-4 col-form-label">
                {mowers.array[key].path}
              </label>
            ) : (
              <input
                type="text"
                class="form-control"
                id="formGroupExampleInput"
                placeholder="Chaîne d'instructions"
                value={mowers.array[key].path}
                onChange={(e) => updatePathMower(e.target.value, key)}
              />
            )}
          </div>
        </div>
      );
    });
  }

  function GetMowers() {
    const started = !(currentMower === 0 && currentAction === 0) || finished;
    return (
      <div className="formMowers">
        <p className="title">Entrer les informations sur les tondeuses :</p>
        <button
          type="button"
          class="btn btn-primary"
          onClick={
            started
              ? () =>
                  alert(
                    "Tu ne peux pas ajouter de tondeuses en cours de route !"
                  )
              : () => addMower()
          }
        >
          {started
            ? "Les tondeuses ne sont plus modifiables"
            : "Ajouter une tondeuse"}
        </button>

        <DisplayMowerForms />
        <Grid container>
          <Grid item>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => startMow()}
            >
              {currentMower === 0 && currentAction === 0 && !finished
                ? "Démarrer la tonte"
                : finished
                ? "La tonte est terminée"
                : "Poursuivre la tonte"}
            </button>
          </Grid>
          <Grid item>
            {started ? (
              finished ? null : (
                <p className="col-form-label textMowerCurrent">
                  La tondeuse {currentMower} est en train de tondre
                </p>
              )
            ) : null}
          </Grid>
        </Grid>
      </div>
    );
  }

  function EndMow() {
    return (
      <div className="endMow">
        <p className="title">La tonte est terminée</p>
        {mowers.array.map((mower, key) => {
          return (
            <p>
              La tondeuse {key + 1} s'est arrêtée en {mower.startX},
              {mower.startY}, orientée {mower.startOrientation}
            </p>
          );
        })}
      </div>
    );
  }
}
