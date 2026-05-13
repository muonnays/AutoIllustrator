import { intro, outro, text, spinner, select, confirm } from '@clack/prompts';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { systemPrompt } from './systemPrompt.js';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VENICE_API_KEY = process.env.VENICE_API_KEY;

if (!VENICE_API_KEY) {
    console.error("Error: VENICE_API_KEY is not set in the environment or .env file.");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: VENICE_API_KEY,
    baseURL: 'https://api.venice.ai/api/v1',
});

async function generateScript(prompt, model, s) {
    const stream = await openai.chat.completions.create({
        model: model,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
        ],
        stream: true,
        venice_parameters: {
            include_venice_system_prompt: false
        }
    });

    s.stop('ExtendScript generation started.');
    console.log('\n--- Generating Script ---');

    let script = '';
    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        process.stdout.write(content);
        script += content;
    }
    
    console.log('\n------------------------\n');

    script = script.trim();
    // Strip markdown formatting if the LLM includes it despite instructions
    script = script.replace(/^```(?:javascript|js|jsx)?\s*/i, '').replace(/```\s*$/i, '').trim();
    return script;
}

function runScript(scriptContent) {
    return new Promise((resolve, reject) => {
        const tmpFile = path.join(__dirname, 'temp.jsx');
        fs.writeFileSync(tmpFile, scriptContent);
        
        const psScript = path.join(__dirname, 'run.ps1');
        
        // Execute the powershell script natively
        const command = `powershell.exe -ExecutionPolicy Bypass -File "${psScript}" -JsxPath "${tmpFile}"`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || stdout || error.message));
                return;
            }
            resolve(stdout);
        });
    });
}

async function main() {
    intro('AutoIllustrator - AI Powered Illustrator CLI');

    const model = await select({
        message: 'Select the Venice API model to use:',
        options: [
            { value: 'zai-org-glm-5-1', label: 'GLM 5.1 (zai-org-glm-5-1)' },
            { value: 'llama-3.3-70b', label: 'Llama 3.3 70B' },
            { value: 'qwen32b', label: 'Qwen 32B' }
        ],
    });

    let running = true;
    while (running) {
        const userPrompt = await text({
            message: 'What would you like Illustrator to do? (or type "exit")',
            placeholder: 'Draw a green star in the center',
        });

        if (!userPrompt || userPrompt.toLowerCase() === 'exit' || userPrompt.toLowerCase() === 'quit') {
            break;
        }

        const s = spinner();
        s.start('Generating ExtendScript...');

        try {
            const scriptContent = await generateScript(userPrompt, model, s);

            const shouldRun = await confirm({
                message: 'Execute this script in Illustrator?',
                initialValue: true
            });

            if (shouldRun) {
                s.start('Executing in Illustrator...');
                try {
                    await runScript(scriptContent);
                    s.stop('Execution complete.');
                } catch (err) {
                    s.stop('Execution failed.');
                    console.error('Error:', err.message);
                }
            } else {
                console.log('Execution skipped.');
            }
        } catch (error) {
            s.stop('Error communicating with Venice API.');
            console.error(error);
        }
        
        console.log('');
    }

    outro('Goodbye!');
}

main().catch(console.error);
