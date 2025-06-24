// CSS-in-JS styles
const styles = {
  body: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "95%",
    margin: 0,
    padding: 0,
    background: "#fff",
  },
  container: {
    position: "relative",
    height: "100px",
    width: "86px",
    transform: "scale(0.5)",
  },
  cube: {
    position: "absolute",
    width: "86px",
    height: "100px",
  },
  face: {
    height: "50px",
    width: "50px",
    position: "absolute",
    transformOrigin: "0 0",
  },
  right: {
    background: "#C2F8ED",
    transform:
      "rotate(-30deg) skewX(-30deg) translate(49px, 65px) scaleY(0.86)",
  },
  left: {
    background: "#54C4C1",
    transform:
      "rotate(90deg) skewX(-30deg) scaleY(0.86) translate(25px, -50px)",
  },
  top: {
    background: "#005B5B",
    transform:
      "rotate(210deg) skew(-30deg) translate(-75px, -22px) scaleY(0.86)",
    zIndex: 2,
  },
};

// Helper to generate cubes with animations
const generateCubes = () => {
  const cubes = [];
  for (let h = 1; h <= 3; h++) {
    for (let w = 1; w <= 3; w++) {
      for (let l = 1; l <= 3; l++) {
        const keyframesName = `h${h}w${w}l${l}`;
        const keyframes = `
          @keyframes ${keyframesName} {
            0% { transform: translate(${w * -50 - 50 + (l * 50 + 50)}px, ${h * 50 - 200 + (w * 25 - 25) + (l * 25 + 25)}px); }
            14% { transform: translate(${w * -50 - 50 + (l * 100 - 50)}px, ${h * 50 - 200 + (w * 25 - 25) + (l * 50 - 25)}px); }
            28% { transform: translate(${w * -100 + 50 + (l * 100 - 50)}px, ${h * 50 - 200 + (w * 50 - 75) + (l * 50 - 25)}px); }
            43% { transform: translate(${w * -100 - 100 + (l * 100 + 100)}px, ${h * 100 - 400 + (w * 50 - 50) + (l * 50 + 50)}px); }
            57% { transform: translate(${w * -100 - 100 + (l * 50 + 200)}px, ${h * 100 - 400 + (w * 50 - 50) + (l * 25 + 100)}px); }
            71% { transform: translate(${w * -50 - 200 + (l * 50 + 200)}px, ${h * 100 - 375 + (w * 25 - 25) + (l * 25 + 100)}px); }
            85% { transform: translate(${w * -50 - 50 + (l * 50 + 50)}px, ${h * 50 - 200 + (w * 25 - 25) + (l * 25 + 25)}px); }
            100% { transform: translate(${w * -50 - 50 + (l * 50 + 50)}px, ${h * 50 - 200 + (w * 25 - 25) + (l * 25 + 25)}px); }
          }
        `;
        const animationName = `${keyframesName}`;
        const animation = `${animationName} 3s ease infinite`;

        // Add styles to the document
        const styleElement = document.createElement("style");
        styleElement.textContent = keyframes;
        document.head.appendChild(styleElement);

        cubes.push(
          <div
            key={`${h}-${w}-${l}`}
            className={`cube h${h} w${w} l${l}`}
            style={{
              ...styles.cube,
              zIndex: -h,
              animation,
            }}
          >
            <div style={{ ...styles.face, ...styles.top }} />
            <div style={{ ...styles.face, ...styles.left }} />
            <div style={{ ...styles.face, ...styles.right }} />
          </div>
        );
      }
    }
  }
  return cubes;
};

// Loader Component
const Loader = () => {
  return (
    <div style={styles.body}>
      <div style={styles.container}>{generateCubes()}</div>
    </div>
  );
};

export default Loader;
