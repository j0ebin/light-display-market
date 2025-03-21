import React, { useState } from 'react';
import RatingComponent from '../shared/RatingComponent';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { testRatingFunctionality, cleanupTestData } from '@/utils/testRating';
import { supabase } from '@/lib/supabase';

const RatingTest: React.FC = () => {
  const [displayRating, setDisplayRating] = useState(3.5);
  const [sequenceRating, setSequenceRating] = useState(4.0);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testDisplayId, setTestDisplayId] = useState<string | null>(null);
  const [testUserId, setTestUserId] = useState<string | null>(null);

  const handleDisplayRatingUpdate = (newRating: number) => {
    setDisplayRating(newRating);
    console.log('Display rating updated:', newRating);
  };

  const handleSequenceRatingUpdate = (newRating: number) => {
    setSequenceRating(newRating);
    console.log('Sequence rating updated:', newRating);
  };

  const runTests = async () => {
    setIsRunningTests(true);
    try {
      // Create test display
      const { data: display, error: displayError } = await supabase
        .from('displays')
        .insert([
          {
            name: 'Test Display',
            location: 'Test Location',
            description: 'Test Description'
          }
        ])
        .select()
        .single();

      if (displayError) throw displayError;
      console.log('✅ Test display created:', display);
      setTestDisplayId(display.id);

      // Create test user
      const { data: auth, error: authError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      });

      if (authError) throw authError;
      console.log('✅ Test user created:', auth.user);
      setTestUserId(auth.user?.id);

      // Run other tests and update the display rating
      const finalRating = await testRatingFunctionality(display.id, auth.user?.id);
      setDisplayRating(finalRating);
    } catch (error) {
      console.error('Test execution failed:', error);
    }
    setIsRunningTests(false);
  };

  const cleanup = async () => {
    try {
      await cleanupTestData();
      setTestDisplayId(null);
      setTestUserId(null);
      setDisplayRating(3.5);
      setSequenceRating(4.0);
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Rating Component Test</h1>

      {/* Test Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Database Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runTests} 
              disabled={isRunningTests}
            >
              {isRunningTests ? 'Running Tests...' : 'Run Database Tests'}
            </Button>
            <Button 
              onClick={cleanup}
              variant="outline"
            >
              Cleanup Test Data
            </Button>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Check the browser console for test results</p>
            {testDisplayId && (
              <p>Test Display ID: {testDisplayId}</p>
            )}
            {testUserId && (
              <p>Test User ID: {testUserId}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Display Rating Test */}
        <Card>
          <CardHeader>
            <CardTitle>Display Rating Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Default Display Rating</h3>
              <RatingComponent
                rating={displayRating}
                itemId={testDisplayId || 'test-display-1'}
                type="display"
                onRatingUpdate={handleDisplayRatingUpdate}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Small Display Rating</h3>
              <RatingComponent
                rating={displayRating}
                itemId={testDisplayId || 'test-display-2'}
                type="display"
                size="sm"
                onRatingUpdate={handleDisplayRatingUpdate}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Large Display Rating with Rate Button</h3>
              <RatingComponent
                rating={displayRating}
                itemId={testDisplayId || 'test-display-3'}
                type="display"
                size="lg"
                showRateButton
                onRatingUpdate={handleDisplayRatingUpdate}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sequence Rating Test */}
        <Card>
          <CardHeader>
            <CardTitle>Sequence Rating Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Default Sequence Rating</h3>
              <RatingComponent
                rating={sequenceRating}
                itemId="test-sequence-1"
                type="sequence"
                onRatingUpdate={handleSequenceRatingUpdate}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Small Sequence Rating</h3>
              <RatingComponent
                rating={sequenceRating}
                itemId="test-sequence-2"
                type="sequence"
                size="sm"
                onRatingUpdate={handleSequenceRatingUpdate}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Large Sequence Rating with Rate Button</h3>
              <RatingComponent
                rating={sequenceRating}
                itemId="test-sequence-3"
                type="sequence"
                size="lg"
                showRateButton
                onRatingUpdate={handleSequenceRatingUpdate}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Component Test Controls */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Component Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => setDisplayRating(0)}>Reset Display Rating</Button>
            <Button onClick={() => setSequenceRating(0)}>Reset Sequence Rating</Button>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Current Display Rating: {displayRating}
            </p>
            <p className="text-sm text-muted-foreground">
              Current Sequence Rating: {sequenceRating}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingTest; 