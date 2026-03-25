---
title: "Generating TIFF files on an Android device"
description: "No library was up to the job, so I read the spec and wrote my own TIFF encoder."
date: 2026-03-25
tags: ["Android", "Kotlin", "TIFF", "Image Processing"]
image: /images/posts/generating-tiff-files-on-an-android-device/header.png
imageAlt: "A smartphone camera lens surrounded by abstract binary data streams and TIFF file grid patterns"
---

I recently built an app with some very specific and unusual requirements. Amongst other things, here's what it had to do:

- Capture RAW image data from the camera lens on a specific mobile phone in a rapid-fire burst. The goal was to capture as much data as possible as rapidly as possible.
- The camera must be set up to take consistent photos under controlled lighting conditions. Autofocus and white balance adjustments must be disabled
- The app must run entirely offline, with no internet connection available at the point of use
- Output must be a **multi-frame TIFF file** with no data loss.

It was that last requirement that threw up an unexpected challenge!

## The problem with TIFF on Android

Android has no native TIFF support. There is no built-in encoder in the SDK, so you're reliant on third-party libraries, and I just couldn't find one! 

So I did what any engineer does when the libraries let them down: I read the spec...the TIFF file spec from 1992, no less!

## Writing a TIFF encoder from scratch

The [TIFF 6.0 specification](https://www.itu.int/itudoc/itu-t/com16/tiff-fx/docs/tiff6.pdf) is intimidating at first but actually turns out to be a very well-structured document. A TIFF file is structured as:

1. An **8-byte header**, establishing byte order, a magic number (`42` - don't know why), and the offset to the first **IFD** (Image File Directory)
2. A series of **IFDs**, one per frame, each containing an ordered list of tagged entries describing that frame's metadata and a pointer to the next IFD
3. The **raw image data** for each frame

For a multi-frame file like ours, the IFDs form a linked list through the file. The last one simply writes `0` as its next-IFD offset to signal the end.

The header itself is just 8 bytes:

```kotlin [SimpleTiffEncoder.kt]
fun writeHeader(out: OutputStream) {
    val header = ByteArray(8)
    header[0] = 73 // "II" - Intel byte order (little-endian)
    header[1] = 73
    header[2] = 42 // magic number
    header[3] = 0
    header[4] = 8  // offset to first IFD (immediately after this header)
    header[5] = 0
    header[6] = 0
    header[7] = 0
    out.write(header)
}
```

Simple enough. It's everything after that gets interesting.

The trickiest part of the implementation wasn't any individual piece. It was computing all the **byte offsets** correctly. Each IFD needs to know exactly where its image data starts in the final file, which depends on the accumulated size of every IFD and image block that precedes it.

```kotlin [SimpleTiffEncoder.kt]
// Offset arithmetic for a given frame
val ifdDataSoFar   = (frameNumber + 1) * ifdByteSize
val imageDataSoFar = frameNumber * imageSizeBytes
val doubleDataSoFar = (frameNumber + 1) * (numberOfBytesInDouble * doubleIfdEntries.size)

val imageStartsAt = headerSize + ifdDataSoFar + imageDataSoFar + doubleDataSoFar
```

The other bump in the road was that IFD entries can only hold 4 bytes of value data inline. For `Double` values (used to embed per-frame metadata like exposure time), you write an offset pointer in the entry itself and stash the actual value at the end of the IFD block. I used a small interface hierarchy to handle this:

```kotlin
interface IIfdEntry {
    val key: Int
    val fieldType: Int
    val count: Int
    val value: Number
}
```

`IntIfdEntry` writes its value inline. `DoubleIfdEntry` triggers the offset-pointer pattern. The encoder collects all double entries during IFD construction, then writes their values after the IFD entries and before the image data.

Each IFD is built from a standard set of tags, with extra ones passed in per-frame:

```kotlin
val ifdEntries: MutableList<IIfdEntry> = mutableListOf(
    IntIfdEntry(TIFF_Tag_ImageWidth,                TIFF_FieldType_Long,  1, width),
    IntIfdEntry(TIFF_Tag_ImageLength,               TIFF_FieldType_Long,  1, height),
    IntIfdEntry(TIFF_Tag_BitsPerSample,             TIFF_FieldType_Short, 1, 16), // RAW = 16-bit
    IntIfdEntry(TIFF_Tag_Compression,               TIFF_FieldType_Short, 1, 1),  // no compression
    IntIfdEntry(TIFF_Tag_PhotometricInterpretation, TIFF_FieldType_Short, 1, 1),  // BlackIsZero
    IntIfdEntry(TIFF_Tag_SamplesPerPixel,           TIFF_FieldType_Short, 1, 1),
    IntIfdEntry(TIFF_Tag_RowsPerStrip,              TIFF_FieldType_Long,  1, height),
    IntIfdEntry(TIFF_Tag_StripByteCounts,           TIFF_FieldType_Long,  1, imageSizeBytes)
)
ifdEntries.addAll(extraEntries)
ifdEntries.sortBy { it.key } // spec requires ascending order
```

The TIFF spec also reserves tag IDs above `32768` for private use, which I took advantage of to embed per-frame capture metadata (capture time, exposure time and ISO speed) directly inside the file, alongside the standard tags.

## The result

Here's how it's used in practice:

```kotlin
val encoder = SimpleTiffEncoder(width, height)
encoder.writeHeader(outputStream)

frames.forEachIndexed { index, frame ->
    encoder.writeTiffPage(outputStream, frame.metadata, frame.pixels, index, frames.size)
}
```

One call to `writeHeader`, then one call to `writeTiffPage` per frame. The output is a valid multi-frame, 16-bit TIFF with embedded capture metadata. No dependencies required.

(Some code has been left out for readability - just wanted to give you the flavour of the implementation!)
