import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

export default function AuthInput({
  accessibilityLabel,
  autoCapitalize = "none",
  autoComplete,
  error,
  icon,
  inputRef,
  keyboardType = "default",
  onChangeText,
  onSubmitEditing,
  placeholder,
  returnKeyType = "next",
  secureTextEntry = false,
  textContentType,
  value,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const FieldIcon = icon;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.field, error && styles.fieldError]}>
        {FieldIcon && (
          <FieldIcon
            accessibilityElementsHidden
            color="#265575"
            size={18}
            strokeWidth={2.25}
            style={styles.icon}
          />
        )}
        <TextInput
          accessibilityLabel={accessibilityLabel || placeholder}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={false}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor="#7890A7"
          ref={inputRef}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry && !passwordVisible}
          style={styles.input}
          textContentType={textContentType}
          value={value}
        />
        {secureTextEntry && (
          <Pressable
            accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={styles.visibilityButton}
          >
            {passwordVisible ? (
              <EyeOff color="#245F8B" size={18} strokeWidth={2.25} />
            ) : (
              <Eye color="#245F8B" size={18} strokeWidth={2.25} />
            )}
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 11 },
  field: {
    minHeight: 53,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D3E3F0",
    backgroundColor: "#FCFEFF",
    paddingLeft: 13,
  },
  fieldError: { borderColor: "#D94C5A" },
  icon: {
    width: 23,
    marginRight: 2,
  },
  input: {
    flex: 1,
    minHeight: 51,
    paddingHorizontal: 10,
    color: "#102F55",
    fontSize: 13,
  },
  visibilityButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: { color: "#B42332", fontSize: 11, marginTop: 4, marginLeft: 4 },
});
