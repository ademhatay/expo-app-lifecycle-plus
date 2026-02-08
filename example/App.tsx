import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Lifecycle from 'expo-app-lifecycle-plus';
import type { LifecycleEvent } from 'expo-app-lifecycle-plus';

export default function App() {
  const [currentState, setCurrentState] = useState(() => Lifecycle.getCurrentState());
  const [events, setEvents] = useState<LifecycleEvent[]>([]);

  useEffect(() => {
    const sub = Lifecycle.addListener((event) => {
      setCurrentState(event.state);
      setEvents((prev) => [event, ...prev].slice(0, 25));
      console.log('lifecycle', event);
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Expo App Lifecycle Plus</Text>
        <Group name="Current State">
          <Text style={styles.currentState}>{currentState}</Text>
        </Group>
        <Group name="Recent Events">
          {events.length === 0 ? (
            <Text style={styles.muted}>No events yet. Background/foreground the app to test.</Text>
          ) : (
            events.map((event, index) => (
              <Text key={`${event.timestamp}-${index}`} style={styles.eventRow}>
                {event.type} | {event.state} | {event.platform}
                {event.activity ? ` | ${event.activity}` : ''}
              </Text>
            ))
          )}
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 12,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  currentState: {
    fontSize: 18,
    fontWeight: 600,
  },
  eventRow: {
    fontSize: 13,
    lineHeight: 20,
  },
  muted: {
    color: '#666',
  },
});
