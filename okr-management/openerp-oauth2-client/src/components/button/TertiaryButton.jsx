import { Button } from "@mui/material";
import { styled } from "@mui/styles";

const TertiaryButton = styled((props) => (
  <Button color="primary" {...props}>
    {props.children}
  </Button>
))(({ theme }) => ({
  textTransform: "none",
}));

export default TertiaryButton;
