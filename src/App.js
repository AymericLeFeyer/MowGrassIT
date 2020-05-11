import React from "react";
import "./App.css";
import { useState } from "react";
import { CardMedia, makeStyles, Card, Grid } from "@material-ui/core";

export default function App() {
  const [gridSize, setGridSize] = useState([5, 5]);
  const [grid, setGrid] = useState(createGrid(gridSize));

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

  return (
    <div className="App">
      <h1>MowGrass-IT</h1>
      <button type="button" class="btn btn-primary">
        Récupérer le sujet
      </button>

      <GetGridSizeArea />
      <DisplayGrid />
      {console.log(grid)}
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
          mower: {
            orientation: "N",
          },
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
                <CardMedia className={classes.cardMedia} />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  function DisplayGrid() {
    return grid.map((row, key) => {
      return DisplayRow(row, key);
    });
  }
}
