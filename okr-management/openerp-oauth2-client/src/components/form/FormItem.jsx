const FormItem = (props) => (
  <div className="flex flex-col gap-1">
    <div>{props.label}</div>
    {props.children}
  </div>
);

export default FormItem;
