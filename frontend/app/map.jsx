// Keep routing free of native-map imports: Metro indexes every file under app/
// while building the web bundle. The platform resolver selects the component.
export { default } from "../components/InteractiveMap";
