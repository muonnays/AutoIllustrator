#target illustrator

// Ensure there is at least one document open, or create a new one
if (app.documents.length === 0) {
    app.documents.add();
}

var doc = app.activeDocument;

// Create a new rectangle (top, left, width, height)
var rect = doc.pathItems.rectangle(400, 200, 200, 100);

// Create a blue RGB color
var blueColor = new RGBColor();
blueColor.red = 0;
blueColor.green = 128;
blueColor.blue = 255;

// Apply the color to the rectangle's fill
rect.fillColor = blueColor;
rect.stroked = false;

// Alert to confirm execution
alert("Hello from AutoIllustrator! A blue rectangle was drawn.");
