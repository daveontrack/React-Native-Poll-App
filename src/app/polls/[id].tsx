import { Stack, useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Poll, Vote } from '../../types/db';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../Providers/AuthProvider';

export default function PollDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [userVote, setUserVote] = useState<Vote | null>(null);
  const [selected, setSelected] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPolls = async () => {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .eq('id', Number.parseInt(id))
        .single();

      if (error) {
        Alert.alert('Error fetching data', error.message);
        return;
      }
      setPoll(data);
    };

    const fetchUserVote = async () => {
      if (!user) {
        return;
      }
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('poll_id', Number.parseInt(id))
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (error) {
        // Handle error if needed
        return;
      }
      if (data) {
        setUserVote(data);
        setSelected(data.option);
      }
    };

    fetchPolls();
    fetchUserVote();
  }, [id, user]);

  const vote = async () => {
    if (!user || !poll || !selected) {
      Alert.alert('Error', 'Please select an option and ensure you are logged in');
      return;
    }

    const newVote: Omit<Vote, 'id' | 'created_at'> & { id?: number; created_at?: string } = {
      option: selected,
      poll_id: poll.id,
      user_id: user.id,
    };

    if (userVote?.id) {
      newVote.id = userVote.id;
      newVote.created_at = userVote.created_at;
    } else {
      newVote.created_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('votes')
      .upsert([newVote])
      .select()
      .single();

    if (error) {
      Alert.alert('Failed to vote', error.message);
      return;
    }
    
    setUserVote(data);
    Alert.alert('Thank you for your vote');
  };

  if (!poll) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Poll voting' }} />

      <Text style={styles.question}>{poll.question}</Text>

      <View style={{ gap: 5 }}>
        {poll.options.map((option) => (
          <Pressable
            onPress={() => setSelected(option)}
            key={option}
            style={styles.optionContainer}
          >
            <Feather
              name={option === selected ? 'check-circle' : 'circle'}
              size={18}
              color={option === selected ? 'green' : 'gray'}
            />
            <Text>{option}</Text>
          </Pressable>
        ))}
      </View>

      <Button onPress={vote} title="Vote" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
  },
  optionContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});