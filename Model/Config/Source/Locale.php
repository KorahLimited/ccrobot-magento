<?php

namespace Korah\CcRobot\Model\Config\Source;

class Locale implements \Magento\Framework\Option\ArrayInterface
{
    public function toOptionArray()
    {
        return [
            ['value' => 'default', 'label' => __('Default')],
            ['value' => 'en', 'label' => 'English'],
            ['value' => 'fr', 'label' => json_decode('"Fran\u00E7ais"')]
        ];
    }
}