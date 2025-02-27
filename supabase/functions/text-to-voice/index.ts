
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

    console.log('Starting text-to-speech generation for:', text)

    const replicate = new Replicate({
      auth: Deno.env.get('REPLICATE_API_KEY'),
    })

    const output = await replicate.run(
      "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
      {
        input: {
          text: text,
          voice: "af_bella",
        }
      }
    )

    console.log('Audio generation completed, output URL:', output)

    return new Response(
      JSON.stringify({ audioUrl: output }),
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
