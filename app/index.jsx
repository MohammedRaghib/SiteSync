import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import Login from './Login';

export default function Index() {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    color: 'black',
  }
});