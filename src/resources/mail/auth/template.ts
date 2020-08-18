export default function template(token: string) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="margin: 0; padding: 0; min-height: 100%; background-color: #2C9BB4; display: block; min-width: 100%;">
        <header style="font-family: 'Recursive', sans-serif; width: 96%; background-color: #FFF; padding: 18px; font-size: 22px; border-radius: 0 0 30px 30px; margin-left: auto; margin-right: auto;">
          <span style=" margin-left: 10px;" >set:it</span>
        </header>
      
        <div style="margin-top: 20px; margin-bottom: 20px; border-radius: 30px; width: 90%; height: 100%; background-color: #FFF; margin-left: auto; margin-right: auto; padding: 20px; display: block; color: #000;">
          <h1 style=" color: #000000; font-size: 24px; margin-top: 30px; text-align: center;">Olá, esqueceu sua senha? Sem problemas, utilize o código abaixo. </h1>
          
          <div style="width: 300px; height: 100px; line-height: 100px; margin-left: auto; margin-right: auto; background-color: #08353F; border-radius: 10px; color: #FFF; font-size: 18px; margin-top: 200px; text-align: center; display: block;">
            <p style="vertical-align: middle; line-height: 1.5; display: inline-block;">${token}</p>
          </div>
        </div>
      </body>
  </html>`;
}
