import React from "react";
import "./App.css";
import { useState } from "react";
import { CardMedia, makeStyles, Card, Grid } from "@material-ui/core";
import { Animate } from "react-move";

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

    console.log(grid);
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
    console.log(grid);
    let p = mowerPos;
    p.x = x;
    p.y = y;
    setMowerPos(p);
  }

  function GetGridSizeArea() {
    return (
      <div>
        <p className="textSizeGrid">Taille de la grille : </p>
        <div class="form-group row sizeForm">
          <label for="example-number-input" class="col-2 col-form-label">
            Hauteur :
          </label>
          <div>
            <input
              class="form-control"
              type="number"
              value={gridSize[0]}
              onChange={(e) => updateSizeArea([e.target.value, gridSize[1]])}
            />
          </div>
        </div>
        <div class="form-group row sizeForm">
          <label for="example-number-input" class="col-2 col-form-label">
            Largeur :
          </label>
          <div>
            <input
              class="form-control"
              type="number"
              value={gridSize[1]}
              onChange={(e) => updateSizeArea([gridSize[0], e.target.value])}
            />
          </div>
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
                  grid[key][key2].card.x = el.getBoundingClientRect().x;
                  grid[key][key2].card.y = el.getBoundingClientRect().y;
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

  function DisplayMower() {
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

  function startMow() {}

  function DisplayMowerForms() {
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
                <div>
                  <input
                    class="form-control"
                    type="number"
                    value={mowers.array[key].startX}
                    // onChange={(e) =>
                    //   updateSizeArea([e.target.value, gridSize[1]])
                    // }
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs>
              <div class="form-group row sizeForm">
                <label for="example-number-input" class="col-4 col-form-label">
                  Position Y :
                </label>
                <div>
                  <input
                    class="form-control"
                    type="number"
                    value={mowers.array[key].startY}
                    // onChange={(e) =>
                    //   updateSizeArea([e.target.value, gridSize[1]])
                    // }
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs>
              <div class="form-group row sizeForm">
                <label for="example-number-input" class="col-4 col-form-label">
                  Orientation :
                </label>
                <div>
                  <select class="form-control">
                    <option>Nord</option>
                    <option>Sud</option>
                    <option>Est</option>
                    <option>Ouest</option>
                  </select>
                </div>
              </div>
            </Grid>
          </Grid>
          <div class="input-group mb-3">
            <div class="input-group-append">
              <button class="btn btn-secondary" type="button">
                D
              </button>
              <button class="btn btn-secondary" type="button">
                G
              </button>
              <button class="btn btn-secondary" type="button">
                A
              </button>
            </div>
            <input
              type="text"
              class="form-control"
              id="formGroupExampleInput"
              placeholder="Chaîne d'instructions"
            />
          </div>
        </div>
      );
    });
  }

  function GetMowers() {
    return (
      <div className="formMowers">
        <p className="title">Entrer les informations sur les tondeuses :</p>
        <button
          type="button"
          class="btn btn-primary"
          onClick={() => addMower()}
        >
          Ajouter une tondeuse
        </button>

        <DisplayMowerForms />

        <button
          type="button"
          class="btn btn-primary"
          onClick={() => startMow()}
        >
          Démarrer la tonte
        </button>
      </div>
    );
  }
}
