import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [amount, setAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch("EXPO_PUBLIC_API_URL", {
        headers: {
          apikey: "EXPO_PUBLIC_API_KEY",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Error fetching exchange rates" + response.statusText,
            );
          }
          return response.json();
        })
        .then((data) => setInterestRate(data.rates))
        .catch((error) =>
          console.error("Error fetching exchange rates:", error),
        );
    };

    fetchData();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
