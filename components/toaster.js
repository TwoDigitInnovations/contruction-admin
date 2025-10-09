import Alert from "@mui/material/Alert";

export default function Toaster(props) {
  return (
    <Alert className="bg-custom-green" severity={props.type}>
      <p className="text-white font-semibold"> {props.message}</p>
    </Alert>
  );
}
