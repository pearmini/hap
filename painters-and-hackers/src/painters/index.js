import styles from './styles';

const labels = styles.reduce((total, cur) => [...total, cur.labels], []);

export default function () {
  const painter = {},
    defaultStyles = styles,
    defaultLabels = labels;

  painter.styles = function (_) {
    return arguments.length ? ((defaultStyles = _), painter) : styles;
  };

  painter.labels = function (_) {
    return arguments.length ? ((defaultLabels = _), painter) : labels;
  };

  return painter;
}
