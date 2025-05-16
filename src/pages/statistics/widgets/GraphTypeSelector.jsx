import { Icon } from "../../../shared/ui/icon";

export const GraphTypeSelector = ({ type, onChange }) => {
  return (
    <div className="graphs__type">
      <a
        href="#"
        className={`button-square-stroke button-small filters__head ${type === "line" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          onChange("line");
        }}
      >
        <Icon name="line-chart" viewBox={"0 0 24 24"} size={12} />
      </a>
      <a
        href="#"
        className={`button-square-stroke button-small filters__head ${type === "bar" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          onChange("bar");
        }}
      >
        <Icon name="bar-chart" size={24} />
      </a>
    </div>
  );
};
