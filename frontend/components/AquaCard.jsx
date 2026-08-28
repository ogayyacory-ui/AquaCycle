import {
  View,
  StyleSheet,
} from "react-native";

import { COLORS } from "../constants/colors";


export default function AquaCard({
  children,
  style,
}) {

  return (
    <View
      style={[
        styles.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}


const styles = StyleSheet.create({

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,

    elevation: 3,
  },

});