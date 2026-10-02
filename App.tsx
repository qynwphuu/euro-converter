import { useEffect, useState } from "react";
import { StyleSheet, Text, Image, Button, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

export default function App() {
  const [amount, setAmount] = useState(0);
  const [interestRate, setInterestRate] = useState<Record<string, number>>({});
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [result, setResult] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      fetch("https://api.apilayer.com/exchangerates_data/latest", {
        method: "GET",
        headers: {
          apikey: process.env.EXPO_PUBLIC_API_KEY || "",
        },
      })
        .then((response) => {
          console.log("Status Code:", response.status);
          if (!response.ok) {
            throw new Error(`Error fetching: status ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.rates) {
            setInterestRate(data.rates);
          }
        })
        .catch((error) =>
          console.error("Error fetching exchange rates:", error),
        );
    };

    fetchData();
  }, []);

  function handleConvert() {
    if (interestRate && selectedCurrency) {
      const rate = interestRate[selectedCurrency];
      if (rate) {
        const convertedAmount = amount / rate;
        setResult(convertedAmount);
      } else {
        console.error("Selected currency not found in exchange rates.");
      }
    } else {
      console.error("Exchange rates or selected currency is not available.");
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image
          source={{
            uri: "https://cdn.pixabay.com/photo/2013/07/12/12/14/euro-145386_1280.png",
          }}
          style={{ width: 100, height: 100 }}
        />

        <Text>Euro Converter</Text>

        <Text
          style={{
            fontSize: 20,
          }}
        >
          {result.toFixed(2)} €
        </Text>

        <TextInput
          placeholder="Enter amount"
          keyboardType="numeric"
          onChangeText={(text) => {
            const parsed = parseFloat(text);
            setAmount(isNaN(parsed) ? 0 : parsed);
          }}
          style={{
            borderColor: "gray",
            borderWidth: 1,
            width: 200,
          }}
        />

        <Picker
          selectedValue={selectedCurrency}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        >
          {Object.keys(interestRate).map((currency) => (
            <Picker.Item key={currency} label={currency} value={currency} />
          ))}
        </Picker>

        <Button title="CONVERT" onPress={handleConvert} />
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
