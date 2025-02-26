
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Replicate from 'https://esm.sh/replicate@0.25.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    const replicate = new Replicate({
      auth: Deno.env.get('REPLICATE_API_KEY'),
    })

    console.log('Generating speech for text:', text)

    const output = await replicate.run(
      "suno-ai/bark",
      {
        input: {
          text: text,
          history_prompt: "v2/en_speaker_6",
          sample_rate: 24000
        }
      }
    )

    if (!output) {
      throw new Error('No audio output generated')
    }

    console.log('Speech generation successful, output:', output)

    return new Response(
      JSON.stringify({ audioContent: output }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Text-to-voice error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
